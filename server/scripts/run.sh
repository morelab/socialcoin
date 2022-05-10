#!/bin/bash
source .env.dev
source venv/bin/activate
export FLASK_APP=src.app
flask run