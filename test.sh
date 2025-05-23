#!/bin/sh

touch den/test{01..10}.txt;
touch den/img{01..10}.png;

echo "Test" | tee den/test{01..10}.txt

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python -m main
