FROM nvidia/opengl:base-ubuntu20.04

RUN DEBIAN_FRONTEND=noninteractive apt install -y curl python3.10 python3.10-distutils libcudnn8
RUN apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y

RUN apt update && apt install -y python3.10 python3.10-distutils wget
RUN wget https://bootstrap.pypa.io/get-pip.py && python3.10 get-pip.py 

COPY requirements.txt ./requirements.txt
RUN python3.10 -m pip install --upgrade pip
RUN python3.10 -m pip install -r requirements.txt


COPY requirements.txt ./requirements.txt

RUN python3.10 -m pip install --upgrade pip && python3.10 -m pip install -r requirements.txt

COPY server.py utils.py config.py mapper.py node.py edge.py model.tflite chess_engine.py app.py util.py ./
RUN apt install -y mesa-utils libfreetype6-dev \
    libportmidi-dev \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev

COPY static templates
COPY ./*.py ./
ENTRYPOINT ["python", "app.py"]
