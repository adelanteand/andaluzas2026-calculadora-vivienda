# Calculadora de precio máximo del alquiler.

Una de las propuestas estrellas del programa de vivienda de Adelante Andalucía es la regulación de los alquileres para que no superen un 20% de la renta media de un barrio. Es decir, estamos proponiendo no solo una bajada drástica del precio, sino una vinculación a los ingresos medios de las familias, de tal manera que se evitan los ataques de la inflación, la gentrificación y turistificación de barrios con alta presión.

## ¿Cómo la explicamos? 
Se trata de popularizar una medida que nos hace diferentes. Nadie en el panorama propone una reivindicación semejante, que a la vez es de sentido común: *Que nadie destine más de un 20% de sus ingresos en pagar la vivienda*. Por eso proponemos una calculadora interactiva en la página web de Adelante Andalucía. 

## ¿En qué consiste la calculadora? 
La calculadora constara de una casilla en la que el usuario tiene que poner la ubicación de su vivienda (Ej.: Calle Cervantes 36 Cádiz) y, el resultado es la estimación del precio de la vivienda que se pagaría si la regulación que propone Adelante Andalucía fuese real.

## ¿Cómo se calcula?
Los datos sobre la renta media de los hogares por distrito censal los podemos encontrar en los siguientes links: https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177088&menu=ultiDatos&idp=1254735976608

En base al salario medio por hogar en cada distrito, la calculadora muestra el 20% de la de la cifra de renta media por hogar al mes.

*Un ejemplo:* Calle Cervantes 36 Cádiz 11003. Renta media por hogar al año: 31.029,49 20% de dicha cantidad al mes: *517,16€ al mes*. 

Además, la calcula muestra un intervalo de un 10% de precios para tener en cuenta el tamaño y calidades de los pisoso.

## Especificaciones técnicas
El trabajo se ha desarrollado sobre HTML y JavaScrip, sin necesidad de backend, todo se calcula en el lado del cliente.

Para la maquetación se ha usado el CDN de bootstrap 5.

Cuando se envía el formuario con el campo de dirección se hacen dos llamadas a endpoints.

1. Endpoint encargado de la localización en función de la dirección. Este endpoint puede devolver un valor un tanto impreciso si la dirección no es concreta. Lo ideal es añadir como mínimo Calle, número, localidad, provincia y código postal. 
https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=Calle%20cervantes%2036%2C%2011003%2C%20c%C3%A1diz&outSR=%7B%22wkid%22%3A102100%7D 

2. Endpoint para conocer las rentas medias anuales por hogar. Obtiene la información directamente del INE y se le pasan los parámetros obtenido en el endpoint anterior.
https://services7.arcgis.com/SEjlCWTAIsMEEXNx/arcgis/rest/services/ADRH_2023_Renta_media_por_persona/FeatureServer/3/query?f=json&returnGeometry=false&geometry=%7B%22xmin%22%3A-701465.8603165227%2C%22ymin%22%3A4374347.363104819%2C%22xmax%22%3A-701243.221334936%2C%22ymax%22%3A4374624.451804138%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&outFields=dato2
El parámetro outFields se refiere a los campos que queremos que nos devuelva, en este caso sólo queremos el dato2 que es el referente a los ingresos medios por hogar, pero se pueden obtener muchos más datos.

## Url de acceso

https://adelanteand.github.io/andaluzas2026-calculadora-vivienda/