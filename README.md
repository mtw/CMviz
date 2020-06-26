# CMviz | covariance model visualization tool

CMviz is an online tool for visualizing covariance models in nucleotide sequences.

_If you would like to use the tool or are interested in the structure of the project itself, please consult our Wiki._

## Dependencies

This project has following dependencies:
```
Django==3.0.7
django-bootstrap4==2.1.1
djangorestframework==3.11.0
pandas==1.0.5
```

It is good to work in a virtual environment to prevent incompatibilities. You can create one quickly by running `python3 -m venv {env-name}`, and activate it by running `source {env-name}/bin/activate`.

You can install dependencies in the active Python environment by running:
```
python3 -m pip install -r requirements.txt
```

## How to run?
If the active Python environment has all the necessary libraries installed, launch the local server by running:
```
python3 manage.py runserver
```
Follow the link given in the description:
```Starting development server at {link}```.