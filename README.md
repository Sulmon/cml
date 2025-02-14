<p align="center">
  <img src="imgs/title_strip_trim.png" width=400>
</p>

[![GHA](https://img.shields.io/github/v/tag/iterative/setup-cml?label=GitHub%20Actions&logo=GitHub)](https://github.com/iterative/setup-cml)
[![npm](https://img.shields.io/npm/v/@dvcorg/cml?logo=npm)](https://www.npmjs.com/package/@dvcorg/cml)

**What is CML?** Continuous Machine Learning (CML) is an open-source library for
implementing continuous integration & delivery (CI/CD) in machine learning
projects. Use it to automate parts of your development workflow, including model
training and evaluation, comparing ML experiments across your project history,
and monitoring changing datasets.

![](imgs/github_cloud_case_lessshadow.png) _On every pull request, CML helps you
automatically train and evaluate models, then generates a visual report with
results and metrics. Above, an example report for a
[neural style transfer model](https://github.com/iterative/cml_cloud_case)._

We built CML with these principles in mind:

- **[GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) for data
  science.** Use GitLab or GitHub to manage ML experiments, track who trained ML
  models or modified data and when. Codify data and models with
  [DVC](#using-cml-with-dvc) instead of pushing to a Git repo.
- **Auto reports for ML experiments.** Auto-generate reports with metrics and
  plots in each Git Pull Request. Rigorous engineering practices help your team
  make informed, data-driven decisions.
- **No additional services.** Build your own ML platform using just GitHub or
  GitLab and your favourite cloud services: AWS, Azure, GCP. No databases,
  services or complex setup needed.

:question: Need help? Just want to chat about continuous integration for ML?
[Visit our Discord channel!](https://discord.gg/bzA6uY7)

:play_or_pause_button: Check out our
[YouTube video series](https://www.youtube.com/playlist?list=PL7WG7YrwYcnDBDuCkFbcyjnZQrdskFsBz)
for hands-on MLOps tutorials using CML!

## Table of contents

1. [Usage](#usage)
2. [Getting started (tutorial)](#getting-started)
3. [Using CML with DVC](#using-cml-with-dvc)
4. [Using self-hosted runners](#using-self-hosted-runners)
5. [Install CML as a package](#install-cml-as-a-package)
6. [Example Projects](#see-also)

## Usage

You'll need a GitHub or GitLab account to begin. Users may wish to familiarize
themselves with [Github Actions](https://help.github.com/en/actions) or
[GitLab CI/CD](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration).
Here, will discuss the GitHub use case.

- **GitLab users**: Please see our
  [docs about configuring CML with GitLab](https://github.com/iterative/cml/wiki/CML-with-GitLab).
- **Bitbucket Cloud users**: Please see our
  [docs on CML with Bitbucket Cloud](https://github.com/iterative/cml/wiki/CML-with-Bitbucket-Cloud).
  _Bitbucket Server support estimated to arrive by May 2021._
- **GitHub Actions users**: The key file in any CML project is
  `.github/workflows/cml.yaml`:

```yaml
name: your-workflow-name
on: [push]
jobs:
  run:
    runs-on: [ubuntu-latest]
    # optionally use a convenient Ubuntu LTS + CUDA + DVC + CML image
    # container: docker://dvcorg/cml-py3:latest
    steps:
      - uses: actions/checkout@v2
      # may need to setup NodeJS & Python3 on e.g. self-hosted
      # - uses: actions/setup-node@v2
      #   with:
      #     node-version: '12'
      # - uses: actions/setup-python@v2
      #   with:
      #     python-version: '3.x'
      - uses: iterative/setup-cml@v1
      - name: Train model
        run: |
          # Your ML workflow goes here
          pip install -r requirements.txt
          python train.py
      - name: Write CML report
        env:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Post reports as comments in GitHub PRs
          cat results.txt >> report.md
          cml-send-comment report.md
```

We helpfully provide CML and other useful libraries pre-installed on our
[custom Docker images](https://github.com/iterative/cml/blob/master/docker/Dockerfile).
In the above example, uncommenting the field
`container: docker://dvcorg/cml-py3:latest` will make the GitHub Actions runner
pull the CML Docker image. The image already has NodeJS, Python 3, DVC and CML
set up on an Ubuntu LTS base with CUDA libraries and
[Terraform](https://www.terraform.io) installed for convenience.

### CML Functions

CML provides a number of helper functions to help package the outputs of ML
workflows (including numeric data and visualizations about model performance)
into a CML report.

Below is a table of CML functions for writing markdown reports and delivering
those reports to your CI system (GitHub Actions or GitLab CI).

| Function                | Description                                                    | Inputs                                                    |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `cml-send-comment`      | Return CML report as a comment in your GitHub/GitLab workflow. | `<path to report> --head-sha <sha>`                       |
| `cml-send-github-check` | Return CML report as a check in GitHub                         | `<path to report> --head-sha <sha>`                       |
| `cml-publish`           | Publish an image for writing to CML report.                    | `<path to image> --title <image title> --md`              |
| `cml-tensorboard-dev`   | Return a link to a Tensorboard.dev page                        | `--logdir <path to logs> --title <experiment title> --md` |

### Customizing your CML report

CML reports are written in
[GitHub Flavored Markdown](https://github.github.com/gfm/). That means they can
contain images, tables, formatted text, HTML blocks, code snippets and more —
really, what you put in a CML report is up to you. Some examples:

:spiral_notepad: **Text** Write to your report using whatever method you prefer.
For example, copy the contents of a text file containing the results of ML model
training:

```bash
cat results.txt >> report.md
```

:framed_picture: **Images** Display images using the markdown or HTML. Note that
if an image is an output of your ML workflow (i.e., it is produced by your
workflow), you will need to use the `cml-publish` function to include it a CML
report. For example, if `graph.png` is output by `python train.py`, run:

```bash
cml-publish graph.png --md >> report.md
```

## Getting Started

1. Fork our
   [example project repository](https://github.com/iterative/example_cml).

> :warning: Note that if you are using GitLab,
> [you will need to create a Personal Access Token](https://github.com/iterative/cml/wiki/CML-with-GitLab#variables)
> for this example to work.

![](imgs/fork_project.png)

> :warning: The following steps can all be done in the GitHub browser interface.
> However, to follow along with the commands, we recommend cloning your fork to
> your local workstation:

```bash
git clone https://github.com/<your-username>/example_cml
```

2. To create a CML workflow, copy the following into a new file,
   `.github/workflows/cml.yaml`:

```yaml
name: model-training
on: [push]
jobs:
  run:
    runs-on: [ubuntu-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - uses: iterative/setup-cml@v1
      - name: Train model
        env:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
        run: |
          pip install -r requirements.txt
          python train.py

          cat metrics.txt >> report.md
          cml-publish confusion_matrix.png --md >> report.md
          cml-send-comment report.md
```

3. In your text editor of choice, edit line 16 of `train.py` to `depth = 5`.

4. Commit and push the changes:

```bash
git checkout -b experiment
git add . && git commit -m "modify forest depth"
git push origin experiment
```

5. In GitHub, open up a Pull Request to compare the `experiment` branch to
   `master`.

![](imgs/make_pr.png)

Shortly, you should see a comment from `github-actions` appear in the Pull
Request with your CML report. This is a result of the `cml-send-comment`
function in your workflow.

![](imgs/cml_first_report.png)

This is the outline of the CML workflow:

- you push changes to your GitHub repository,
- the workflow in your `.github/workflows/cml.yaml` file gets run, and
- a report is generated and posted to GitHub.

CML functions let you display relevant results from the workflow — such as model
performance metrics and visualizations — in GitHub checks and comments. What
kind of workflow you want to run, and want to put in your CML report, is up to
you.

## Using CML with DVC

In many ML projects, data isn't stored in a Git repository, but needs to be
downloaded from external sources. [DVC](https://dvc.org) is a common way to
bring data to your CML runner. DVC also lets you visualize how metrics differ
between commits to make reports like this:

![](imgs/dvc_cml_long_report.png)

The `.github/workflows/cml.yaml` file used to create this report is:

```yaml
name: model-training
on: [push]
jobs:
  run:
    runs-on: [ubuntu-latest]
    container: docker://dvcorg/cml-py3:latest
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        env:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Install requirements
          pip install -r requirements.txt

          # Pull data & run-cache from S3 and reproduce pipeline
          dvc pull data --run-cache
          dvc repro

          # Report metrics
          echo "## Metrics" >> report.md
          git fetch --prune
          dvc metrics diff master --show-md >> report.md

          # Publish confusion matrix diff
          echo "## Plots" >> report.md
          echo "### Class confusions" >> report.md
          dvc plots diff --target classes.csv --template confusion -x actual -y predicted --show-vega master > vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          # Publish regularization function diff
          echo "### Effects of regularization" >> report.md
          dvc plots diff --target estimators.csv -x Regularization --show-vega master > vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          cml-send-comment report.md
```

> :warning: If you're using DVC with cloud storage, take note of environment
> variables for your storage format.

### Environment variables for supported cloud providers

<details>
  <summary>
  S3 and S3-compatible storage (Minio, DigitalOcean Spaces, IBM Cloud Object Storage...)
  </summary>

```yaml
# Github
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
```

> :point_right: `AWS_SESSION_TOKEN` is optional.

</details>

<details>
  <summary>
  Azure
  </summary>

```yaml
env:
  AZURE_STORAGE_CONNECTION_STRING:
    ${{ secrets.AZURE_STORAGE_CONNECTION_STRING }}
  AZURE_STORAGE_CONTAINER_NAME: ${{ secrets.AZURE_STORAGE_CONTAINER_NAME }}
```

</details>

<details>
  <summary>
  Aliyun
  </summary>

```yaml
env:
  OSS_BUCKET: ${{ secrets.OSS_BUCKET }}
  OSS_ACCESS_KEY_ID: ${{ secrets.OSS_ACCESS_KEY_ID }}
  OSS_ACCESS_KEY_SECRET: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
  OSS_ENDPOINT: ${{ secrets.OSS_ENDPOINT }}
```

</details>

<details>
  <summary>
  Google Storage
  </summary>

> :warning: Normally, `GOOGLE_APPLICATION_CREDENTIALS` is the **path** of the
> `json` file containing the credentials. However in the action this secret
> variable is the **contents** of the file. Copy the `json` contents and add it
> as a secret.

```yaml
env:
  GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }}
```

</details>

<details>
  <summary>
  Google Drive
  </summary>

> :warning: After configuring your
> [Google Drive credentials](https://dvc.org/doc/command-reference/remote/add)
> you will find a `json` file at
> `your_project_path/.dvc/tmp/gdrive-user-credentials.json`. Copy its contents
> and add it as a secret variable.

```yaml
env:
  GDRIVE_CREDENTIALS_DATA: ${{ secrets.GDRIVE_CREDENTIALS_DATA }}
```

</details>

## Using self-hosted runners

GitHub Actions are run on GitHub-hosted runners by default. However, there are
many great reasons to use your own runners: to take advantage of GPUs; to
orchestrate your team's shared computing resources, or to access on-premise
data.

> :point_up: **Tip!** Check out the
> [official GitHub documentation](https://help.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
> to get started setting up your own self-hosted runner.

### Allocating cloud resources with CML

When a workflow requires computational resources (such as GPUs), CML can
automatically allocate cloud instances using `cml-runner`. You can spin up
instances on your AWS or Azure account (GCP support is forthcoming!).

For example, the following workflow deploys a `t2.micro` instance on AWS EC2 and
trains a model on the instance. After the job runs, the instance automatically
shuts down.

You might notice that this workflow is quite similar to the
[basic use case](#usage) above. The only addition is `cml-runner` and a few
environment variables for passing your cloud service credentials to the
workflow.

```yaml
name: Train-in-the-cloud
on: [push]
jobs:
  deploy-runner:
    runs-on: [ubuntu-latest]
    steps:
      - uses: iterative/setup-cml@v1
      - uses: actions/checkout@v2
      - name: Deploy runner on EC2
        env:
          repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          cml-runner \
              --cloud aws \
              --cloud-region us-west \
              --cloud-type=t2.micro \
              --labels=cml-runner
  model-training:
    needs: [deploy-runner]
    runs-on: [self-hosted, cml-runner]
    container: docker://dvcorg/cml-py3:latest
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        env:
          repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        run: |
          pip install -r requirements.txt
          python train.py

          cat metrics.txt > report.md
          cml-send-comment report.md
```

In the workflow above, the `deploy-runner` step launches an EC2 `t2-micro`
instance in the `us-west` region. The `model-training` step then runs on the
newly-launched instance.

> :tada: **Note that you can use any container with this workflow!** While you
> must [have CML and its dependencies set up](#install-cml-as-a-package) to use
> functions such `cml-send-comment` from your instance, you can create your
> favourite training environment in the cloud by pulling the Docker container of
> your choice.

We like the CML container (`docker://dvcorg/cml-py3`) because it comes loaded
with Python, CUDA, `git`, `node` and other essentials for full-stack data
science.

### Arguments

The `cml-runner` function accepts the following arguments:

```
Usage: cml-runner.js

Options:
  --version                    Show version number                     [boolean]
  --labels                     One or more user-defined labels for this runner
                               (delimited with commas)          [default: "cml"]
  --idle-timeout               Time in seconds for the runner to be waiting for
                               jobs before shutting down. Setting it to 0
                               disables automatic shutdown        [default: 300]
  --name                       Name displayed in the repository once registered
                                                     [default: "cml-4wdd123kha"]
  --single                     Exit after running a single job
                                                      [boolean] [default: false]
  --reuse                      Don't launch a new runner if an existing one has
                               the same name or overlapping labels
                                                      [boolean] [default: false]
  --driver                     Platform where the repository is hosted. If not
                               specified, it will be inferred from the
                               environment         [choices: "github", "gitlab"]
  --repo                       Repository to be used for registering the runner.
                               If not specified, it will be inferred from the
                               environment
  --token                      Personal access token to register a self-hosted
                               runner on the repository. If not specified, it
                               will be inferred from the environment
  --cloud                      Cloud to deploy the runner
                                                       [choices: "aws", "azure"]
  --cloud-region               Region where the instance is deployed. Choices:
                               [us-east, us-west, eu-west, eu-north]. Also
                               accepts native cloud regions [default: "us-west"]
  --cloud-type                 Instance type. Choices: [m, l, xl]. Also supports
                               native types like i.e. t2.micro
  --cloud-gpu                  GPU type.      [choices: "nogpu", "k80", "tesla"]
  --cloud-hdd-size             HDD size in GB.
  --cloud-ssh-private          Custom private RSA SSH key. If not provided an
                               automatically generated throwaway key will be
                               used                                [default: ""]
  --cloud-ssh-private-visible  Show the private SSH key in the output with the
                               rest of the instance properties (not recommended)
                                                                       [boolean]
  --cloud-spot                 Request a spot instance                 [boolean]
  --cloud-spot-price           Maximum spot instance bidding price in USD.
                               Defaults to the current spot bidding price
                                                                 [default: "-1"]
  --cloud-startup-script       Run the provided Base64-encoded Linux shell
                               script during the instance initialization
                                                                   [default: ""]
  -h                           Show help                               [boolean]
```

### Environment variables

> :warning: You will need to
> [create a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
> with repository read/write access and workflow privileges. In the example
> workflow, this token is stored as `PERSONAL_ACCESS_TOKEN`.

Note that you will also need to provide access credentials for your cloud
compute resources as secrets. In the above example, `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are required to deploy EC2 instances.

Please see our docs about
[environment variables needed to authenticate with supported cloud services](#environment-variables-for-supported-cloud-providers).

### On-premise (local) runners

This means using on-premise machines as self-hosted runners. The `cml-runner`
function is used to set up a local self-hosted runner. On your local machine or
on-premise GPU cluster, [install CML as a package](#install-cml-as-a-package)
and then run:

```bash
cml-runner \
    --repo $your_project_repository_url \
    --token=$PERSONAL_ACCESS_TOKEN \
    --labels tf \
    --idle-timeout 180
```

Now your machine will be listening for workflows from your project repository.

## Install CML as a package

In the examples above, CML is installed by the `setup-cml` action, or comes
pre-installed in a custom Docker image pulled by a CI runner. You can also
install CML as a package:

```bash
npm i -g @dvcorg/cml
```

You may need to install additional dependencies to use DVC plots and Vega-Lite
CLI commands:

```bash
sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
                        librsvg2-dev libfontconfig-dev
npm install -g vega-cli vega-lite
```

CML and Vega-Lite package installation require the NodeJS package manager
(`npm`) which ships with NodeJS. Installation instructions are below.

### Install NodeJS in GitHub

This is probably not necessary when using GitHub's default containers or one of
CML's Docker containers. Self-hosted runners may need to use a set up action to
install NodeJS:

```bash
uses: actions/setup-node@v2
  with:
    node-version: '12'
```

### Install NodeJS in GitLab

GitLab requires direct installation of NodeJS:

```bash
curl -sL https://deb.nodesource.com/setup_12.x | bash
apt-get update
apt-get install -y nodejs
```

## See Also

These are some example projects using CML.

- [Basic CML project](https://github.com/iterative/cml_base_case)
- [CML with DVC to pull data](https://github.com/iterative/cml_dvc_case)
- [CML with Tensorboard](https://github.com/iterative/cml_tensorboard_case)
- [CML with a small EC2 instance](https://github.com/iterative/cml-runner-base-case)
- [CML with EC2 GPU](https://github.com/iterative/cml_cloud_case)
