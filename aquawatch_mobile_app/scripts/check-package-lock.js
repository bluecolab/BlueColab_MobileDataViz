#!/usr/bin/env node
/*
  Validates package-lock.json to catch risky references before builds/merges.
  Fails on:
   - missing or unreadable package-lock.json
   - dependencies resolved from non-HTTPS or non-registry sources (git+, ssh, file:)
   - missing integrity for resolved tarballs

  You can optionally allow additional registries by setting ALLOWED_REGISTRIES
  as a comma-separated list of URL prefixes (e.g. "https://registry.npmjs.org/,https://registry.yourco.com/").
*/

const fs = require('fs');
const path = require('path');

const lockPath = path.resolve(process.cwd(), 'package-lock.json');

function fail(msg, details) {
    console.error(`\n❌ package-lock validation failed: ${msg}`);
    if (details) console.error(details);
    process.exit(1);
}

function warn(msg) {
    console.warn(`⚠️  ${msg}`);
}

function readLockfile(p) {
    if (!fs.existsSync(p)) fail('package-lock.json not found');
    try {
        const raw = fs.readFileSync(p, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        fail('Unable to read/parse package-lock.json', e?.message);
    }
}

function getAllowedRegistries() {
    const env = process.env.ALLOWED_REGISTRIES;
    const defaults = ['https://registry.npmjs.org/'];
    if (!env) return defaults;
    return env
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

function isAllowedResolved(url, allowed) {
    if (!url) return true; // some entries (like the root) won't have resolved
    if (url.startsWith('http://')) return false; // require https
    if (url.startsWith('git+')) return false;
    if (url.startsWith('ssh://')) return false;
    if (url.startsWith('file:')) return false;
    // allow from an allowed registry
    return allowed.some((prefix) => url.startsWith(prefix));
}

function collectIssuesV2V3(lock, allowed) {
    const issues = [];
    const pkgs = lock.packages || {};
    for (const [pkgPath, meta] of Object.entries(pkgs)) {
        if (!meta || typeof meta !== 'object') continue;
        const name = meta.name || pkgPath || '(unknown)';
        const { resolved, integrity, version } = meta;
        if (resolved && !isAllowedResolved(resolved, allowed)) {
            issues.push(
                `Package ${name}@${version || 'unknown'} resolved from disallowed source: ${resolved}`
            );
        }
        if (resolved && !integrity) {
            issues.push(
                `Package ${name}@${version || 'unknown'} is missing integrity field (resolved: ${resolved}).`
            );
        }
    }
    return issues;
}

function collectIssuesV1(lock, allowed) {
    const issues = [];
    function walkDeps(deps, chain = []) {
        if (!deps) return;
        for (const [name, meta] of Object.entries(deps)) {
            const pathStr = [...chain, name].join(' > ');
            if (!meta || typeof meta !== 'object') continue;
            const { resolved, integrity, version, dependencies } = meta;
            if (resolved && !isAllowedResolved(resolved, allowed)) {
                issues.push(
                    `Package ${pathStr}@${version || 'unknown'} resolved from disallowed source: ${resolved}`
                );
            }
            if (resolved && !integrity) {
                issues.push(
                    `Package ${pathStr}@${version || 'unknown'} is missing integrity field (resolved: ${resolved}).`
                );
            }
            walkDeps(dependencies, [...chain, name]);
        }
    }
    walkDeps(lock.dependencies);
    return issues;
}

function main() {
    const lock = readLockfile(lockPath);
    const allowed = getAllowedRegistries();
    const v = Number(lock.lockfileVersion) || 0;

    if (!v)
        warn(
            'lockfileVersion is missing or invalid. Make sure you are using a supported npm version.'
        );

    let issues = [];
    if (v >= 2) {
        issues = collectIssuesV2V3(lock, allowed);
    } else {
        issues = collectIssuesV1(lock, allowed);
    }

    if (issues.length) {
        const list = issues.map((i) => ` - ${i}`).join('\n');
        fail('Disallowed or insecure entries detected in package-lock.json:\n' + list);
    }

    console.log('✅ package-lock.json validation passed');
}

main();
