FROM python:3.12-slim-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests \
    build-essential ffmpeg \
    && pip install --no-cache-dir --upgrade pip

WORKDIR /app

# Don't produce .pyc files
ENV PYTHONUNBUFFERED 1    

# Don't buffer stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1

COPY ./requirements.txt /app

RUN pip install --no-cache-dir -r ./requirements.txt

COPY . /app

CMD ["python3", "consumer.py"]