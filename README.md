# ha-aula-card
HA card for displaying Aula information

# Prerequirements

This card relays on the Aula integration made by JBoye <https://github.com/JBoye/HA-Aula>. To use this you need this integration installed on your HA.

# Installation

1. Download the repo and store the files from the src folder inside 
``` 
<HA config>/www/aula
```


2. Make sure to manually down a JPG picture for your card and name it picture.jpg and put it inside folder mentioned above.
 
3. Add the Javascript file as a Module to HA. By going to:
 ``` 
 http://<IP of the HA>:8123/config/lovelace/resources
 ```
 And add the following URL:
 ``` 
 /local/aula/aula.js
 ``` 

4. Create a new card on a dashboard using the manual option (search for manual and choose the YAML option)
5. Use the following example code to create the card:
 ``` 
 type: custom:aula-frontend
 entity: sensor.<name of the Aula sensor>
 ```
