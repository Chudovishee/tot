#!/bin/bash

nginx

source /etc/default/prometheus
nohup /usr/bin/prometheus $ARGS &

source /etc/default/prometheus-node-exporter 
nohup /usr/bin/prometheus-node-exporter $ARGS &

bash
