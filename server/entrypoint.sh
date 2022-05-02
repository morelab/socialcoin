#!/bin/bash
gunicorn -b 0.0.0.0:5000 --chdir ./src app:app --log-level debug