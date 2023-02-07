# ha-aula-card
HA card for displaying Aula information

# Prerequirements

This card relays on the Aula integration made by JBoye <https://github.com/JBoye/HA-Aula>. To use this you need this integration installed on your HA.

# Installation

1. Download the repo and store the files from the src folder inside 
> <HA config>/www/aula

2. Make sure to manually down a JPG picture for your card and name it picture.jpg and put it inside folder mentioned above.

3. Create a new card on a dashboard using the manual option (search for manual and choose the YAML option)
4. Use the following example code to create the card:
> type: custom:aula-frontend
 entity: sensor.<name of the Aula sensor>
