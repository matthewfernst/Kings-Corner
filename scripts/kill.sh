#!/usr/bin/env sh

node_processes_string=$(ps -ax | grep node)
server_processes_string=$(grep server/index.js <<< "${node_processes_string}")

IFS=$'\n'; 
server_processes_arr=($server_processes_string); 
unset IFS;

for i in "${server_processes_arr[@]}"
do
   string_array=($i)
   sudo kill -9 "${string_array[0]}"
done

echo "Killed All Node Server Processes"
