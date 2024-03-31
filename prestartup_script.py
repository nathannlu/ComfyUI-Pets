import subprocess
import folder_paths
import os

def is_git_up_to_date():
    try:
        # Run git fetch to update remote branches
        subprocess.run(["git", "fetch"])

        # Check if the local branch is behind the remote branch
        result = subprocess.run(["git", "status", "-uno"], capture_output=True, text=True)
        output = result.stdout

        # If "Your branch is up to date" is found in the output, the repository is up to date
        if "Your branch is up to date" in output:
            return True
        else:
            return False
    except Exception as e:
        print("Error:", e)
        return False

def pull_latest():
    try:
        # Run git pull to fetch and merge changes from the remote repository
        subprocess.run(["git", "pull"])
        print("Comfy Pets repository is up to date.")
    except Exception as e:
        print("Error:", e)

# Change the current working directory to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
if is_git_up_to_date():
    print("Comfy Pets is up to date.")
else:
    print("Comfy Pets is not up to date. Pulling latest changes...")
    pull_latest()

os.chdir(folder_paths.base_path)
