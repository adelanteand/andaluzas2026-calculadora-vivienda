const form = document.querySelector('form');
const direccionInput = document.querySelector('#direccion');
let geometryParams = { "xmin": -568602.00437621586, "ymin": 4471863.16399280075, "xmax": -568379.365394629305, "ymax": 4472142.80721383076, "spatialReference": { "wkid": 102100 } };

if (form && direccionInput) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('result').classList.add('d-none');
    document.getElementById('error').classList.add('d-none');

    const direccion = direccionInput.value.trim();
    const query1 =
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=' +
      encodeURIComponent(direccion) +
      '&outSR=%7B%22wkid%22%3A102100%7D';
    let rentaMedia = 0;
    let alquilerCalculado = 0;

    console.log('Dirección ingresada:', direccion);
    console.log('Query 1:', query1);

    fetch(query1)
      .then(response => response.json())
      .then(data => {
        console.log('Resultado de query1:', data);

        if (data && data.candidates && data.candidates.length > 0) {
          const extent = data.candidates[0].extent;
          const extentString = JSON.stringify(extent);
          console.log('Extent string:', extentString);

          // Actualizar geometryParams con los valores de extent
          geometryParams.xmin = extent.xmin;
          geometryParams.ymin = extent.ymin;
          geometryParams.xmax = extent.xmax;
          geometryParams.ymax = extent.ymax;

          console.log('GeometryParams actualizado:', geometryParams);

          // Construir query2 con geometryParams actualizado
          const query2 = 'https://services7.arcgis.com/SEjlCWTAIsMEEXNx/arcgis/rest/services/ADRH_2023_Renta_media_por_persona/FeatureServer/3/query?f=json&returnGeometry=false&geometry=' + encodeURIComponent(JSON.stringify(geometryParams)) + '&outFields=dato2';
          console.log('Query 2:', query2);

          // Hacer la llamada a query2
          return fetch(query2)
            .then(response => response.json())
            .then(data2 => {
              data2.features.forEach(feature => {
                rentaMedia = feature.attributes.dato2;
                console.log('Valor de dato2:', feature.attributes.dato2);
              });

              if (rentaMedia === 0) {
                throw new Error('Renta media es 0');
              }

              alquilerCalculado = rentaMedia * 0.2 / 12;

              document.getElementById('rentaMedia').textContent = `Renta media por hogar al año: ${rentaMedia.toFixed(2)} €`;
              document.getElementById('rentaMediaMensual').textContent = `Renta media por hogar al mes: ${(rentaMedia / 12).toFixed(2)} €`;
              document.getElementById('alquilerCalculado').textContent = `Alquiler calculado: ${alquilerCalculado.toFixed(2)} € al mes`;
              document.getElementById('result').classList.remove('d-none');

              console.log('Resultado de query2:', data2);
            });
        }
      })
      .catch(error => {
        document.getElementById('error').classList.remove('d-none');
        console.error('Error:', error);
      });
  });
}
