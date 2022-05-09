#!/bin/bash
source .env.test
source venv/bin/activate
coverage run --source=src -m pytest
coverage html
coverage report