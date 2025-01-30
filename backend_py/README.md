# AquaWatch Mobile Backend

This folder contains the various files related to the backend.

## Tech Stack
-   Languages
    -   [Python 🔗](https://www.python.org/)
-   UI Components
    -   [Shiny 🔗](https://shiny.posit.co/py/)
-   Deploy
    -   [Shiny Apps IO 🔗](https://www.shinyapps.io/)

## Getting Started
1. Install all of the following:
   1. [git 🔗](https://git-scm.com/) - version control. For installing git, please see the [git website 🔗](https://git-scm.com/).
   2. [Python 3.11.x 🔗](https://www.python.org/) - language. For installing Python 3.11.x, please see the [here 🔗](https://www.python.org/downloads/release/python-3119/). When installing Python, make sure to check "Add python.EXE to PATH". It is important that you use Python 3.11 at this time as Shiny does not support newer versions of Python.
   3. [VS Code](https://code.visualstudio.com/) with [Shiny](https://marketplace.visualstudio.com/items?itemName=Posit.shiny) Extension. While other editors may work, VS Code + Shiny is easiest to test in VS Code.
2. Open a terminal in this directory ``../BlueColab_MobileDataViz/backend_py/``
3. Run ``pip install -r requirements.txt``, it installs all needed python packages. If the former does not work, please install the following packages with pip:
   1. ``dataretrieval``
   2. ``pandas``
   3. ``plotly``
   4. ``rsconnect_python``
   5. ``shiny``
   6. ``shinywidgets``

> [!IMPORTANT]
> Manually installing packages can cause version-conflict issues. Please ensure you install the correct versions as listed in [requirements.txt](./requirements.txt). See [this here](https://stackoverflow.com/a/5226504) for help on how.

## Running locally on computer
1. Using VS Code with Shiny is the easiest way to run. 
2. Open app.py and click the the Run (Play) Button at the top.
3. A side panel should pop up.

## Running locally on mobile device (unofficial)
1. Run the runner.py file.
2. In the terminal, the following should appear: `Your Shiny Python should be served on http://xxx.xxx.xxx:9999`. 
3. Go to the website on your phone.
4. Note that as this is unofficial not all devices may support this. Generally your computer and phone must be on same network. Firewalls may present issues as well. 
5. As an alternative, most browsers support [device mode testing](https://developer.chrome.com/docs/devtools/device-mode). 

For instructions on deploying, please see our [GitHub Wiki](https://github.com/bluecolab/BlueColab_MobileDataViz/wiki/Backend-Deployment).
