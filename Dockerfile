FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# dotenv sometimes has problems when installed throw requirements 
# installing directly seems to work fine.
RUN pip install -U python-dotenv

COPY . .

ENV FLASK_APP=run.py
ENV FLASK_ENV=development


CMD ["flask", "run", "--host=0.0.0.0"]