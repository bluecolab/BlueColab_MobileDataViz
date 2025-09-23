const fs = require('fs');
const https = require('https');

// Load package-lock.json
const packageLockPath = 'package-lock.json';
const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'));

// Get the current date and calculate the cutoff (24 hours ago)
const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const cleanPackageName = (pkgName) => {
    // Remove everything before and including the last occurrence of "node_modules/"
    return pkgName.replace(/.*node_modules\//, '');
};

// Function to fetch metadata from the npm registry
const fetchPackageMetadata = (() => {
    const cache = new Map(); // Cache to store package metadata (entire time object)

    return (packageName, version) => {
        if (cache.has(packageName)) {
            const metadata = cache.get(packageName);
            if (metadata.time[version]) {
                return Promise.resolve(new Date(metadata.time[version]));
            } else {
                return Promise.reject(
                    `Version ${version} not found in cached metadata for ${packageName}`
                );
            }
        }

        return new Promise((resolve, reject) => {
            const url = `https://registry.npmjs.org/${packageName}`;
            https
                .get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const metadata = JSON.parse(data);
                            cache.set(packageName, metadata); // Cache the entire metadata object
                            if (metadata.time[version]) {
                                resolve(new Date(metadata.time[version]));
                            } else {
                                reject(
                                    `Version ${version} not found in metadata for ${packageName}`
                                );
                            }
                        } catch (err) {
                            reject(`Failed to parse metadata for ${packageName}: ${err.message}`);
                        }
                    });
                })
                .on('error', (err) => {
                    reject(`Failed to fetch metadata for ${packageName}: ${err.message}`);
                });
        });
    };
})();

const fetchMainBranchPackageLock = () => {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec('git show main:aquawatch_mobile_app/package-lock.json', (err, stdout, stderr) => {
            if (err) {
                reject(`Failed to fetch package-lock.json from main: ${stderr}`);
            } else {
                try {
                    const mainPackageLock = JSON.parse(stdout);
                    resolve(mainPackageLock);
                } catch (parseErr) {
                    reject(`Failed to parse package-lock.json from main: ${parseErr.message}`);
                }
            }
        });
    });
};

// Function to check package publish dates
const checkPackagePublishDates = async () => {
    const mainPackageLock = await fetchMainBranchPackageLock().catch((err) => {
        console.error(err);
        process.exit(1);
    });

    const mainPackages = mainPackageLock.packages || {};
    const currentPackages = packageLock.packages || {};
    let hasRecentPackage = false;

    for (const [pkgName, pkgData] of Object.entries(currentPackages)) {
        const cleanName = cleanPackageName(pkgName);

        // Skip packages that exist in the main branch with the same version
        if (mainPackages[pkgName] && mainPackages[pkgName].version === pkgData.version) {
            continue;
        }

        console.log(`Checking package: ${cleanName}`);

        if (pkgData.resolved && pkgData.version) {
            try {
                const installedVersion = pkgData.version;

                // Fetch publish date for the specific version
                const publishDate = await fetchPackageMetadata(cleanName, installedVersion);

                // Check if the package was published within the last 24 hours
                if (publishDate > oneDayAgo) {
                    console.error(
                        `Package "${cleanName}@${installedVersion}" was published recently on ${publishDate.toISOString()}.`
                    );
                    hasRecentPackage = true;
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.warn(
                `Package "${pkgName}" with clean name "${cleanName}" does not have a resolved URL or version.`
            );
        }
    }

    if (hasRecentPackage) {
        console.error('Build failed: One or more packages were published less than 1 day ago.');
        process.exit(1); // Fail the build
    } else {
        console.log('All packages are older than 1 day. Build can proceed.');
    }
};

// Run the check
checkPackagePublishDates();
