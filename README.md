# ha-aula-card
HA card for displaying Aula information

# Preview 

Light mode:

![image](https://user-images.githubusercontent.com/6505811/224432756-70e4d372-6831-461b-94d4-9196d959396d.png)

Dark mode:

![image](https://user-images.githubusercontent.com/6505811/224433066-7cdabdd8-2fd3-43c1-899c-f05256de8b47.png)


# Prerequirements

This card relays on the Aula integration made by scaarup <https://github.com/scaarup/aula>. To use this you need this integration installed on your HA.

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
 
 # Versions
 
 ## Version 1.0
The first update since my inital release. This redesigns the html and css, so that it works great with tablets and mobile phones
https://github.com/kennethfresedk/ha-aula-card/releases/tag/v.1.0
