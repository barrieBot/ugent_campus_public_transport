#Optionally here setup for node/ts
FROM node:20-bullseye AS compiled_frontend

WORKDIR /compile

COPY /app/static/package*.json ./
COPY /app/static/tsconfig.json ./
RUN npm install 

COPY /app/static/src/ ./src
RUN npx tsc



FROM python:3.13-slim

WORKDIR /project

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# dotenv sometimes has problems when installed through requirements 
# installing directly seems to work fine.
RUN pip install -U python-dotenv

# Don't want to make a .dockerignore ....
# Manually build the project in the Container, using only the important files
COPY run.py .
COPY .env .
COPY app/__init__.py app/
COPY app/routes.py app/
COPY app/utils app/utils/
COPY app/templates app/templates/
COPY app/static/styles.css app/static/
COPY app/static/resources app/static/resources/

#COPY JS from the npx build to here
COPY --from=compiled_frontend /compile/dist app/static/dist/

ENV FLASK_APP=run.py
ENV FLASK_ENV=development


CMD ["flask", "run", "--host=0.0.0.0"]