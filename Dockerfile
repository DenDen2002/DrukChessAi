FROM python:3

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    python3-pygame

# Set display environment variable
ENV DISPLAY host.docker.internal:0

# Set working directory
WORKDIR /app

# Copy and install application files
COPY . /app
RUN pip install -r requirements.txt

# Run the application
CMD [ "python", "app.py" ]
