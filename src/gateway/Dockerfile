# Stage 1: Build

FROM python:3.12-slim-bullseye AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests build-essential
    
RUN rm -rf /**var**/lib/apt/lists/*

WORKDIR /app

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r ./requirements.txt

# Stage 2: Run

FROM python:3.12-slim-bullseye

WORKDIR /app

COPY --from=build /app/venv ./venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

COPY . /app

# Don't produce .pyc files
ENV PYTHONUNBUFFERED 1    
# Don't buffer stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1

CMD ["python3", "server.py"]

EXPOSE 8080