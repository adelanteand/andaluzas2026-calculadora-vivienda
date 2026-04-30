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
    let rentaMediaMensual = 0;
    let alquilerCalculado = 0;
    let alquilerCalculado1 = 0;
    let alquilerCalculado2 = 0;

    fetch(query1)
      .then(response => response.json())
      .then(data => {

        if (data && data.candidates && data.candidates.length > 0) {
          const extent = data.candidates[0].extent;
          const extentString = JSON.stringify(extent);

          // Actualizar geometryParams con los valores de extent
          geometryParams.xmin = extent.xmin;
          geometryParams.ymin = extent.ymin;
          geometryParams.xmax = extent.xmax;
          geometryParams.ymax = extent.ymax;

          // Construir query2 con geometryParams actualizado
          const query2 = 'https://services7.arcgis.com/SEjlCWTAIsMEEXNx/arcgis/rest/services/ADRH_2023_Renta_media_por_persona/FeatureServer/3/query?f=json&returnGeometry=false&geometry=' + encodeURIComponent(JSON.stringify(geometryParams)) + '&outFields=dato2';

          // Hacer la llamada a query2
          return fetch(query2)
            .then(response => response.json())
            .then(data2 => {
              data2.features.forEach(feature => {
                rentaMedia = feature.attributes.dato2;
              });

              if (rentaMedia === 0) {
                throw new Error('Renta media es 0');
              }

              rentaMedia = Number(rentaMedia);
              rentaMediaMensual = rentaMedia / 12;
              alquilerCalculado = rentaMedia * 0.2 / 12;
              alquilerCalculado1 = alquilerCalculado * 0.95;
              alquilerCalculado2 = alquilerCalculado * 1.05;
              console.log('Renta media:', rentaMedia);
              console.log('Renta media mensual:', rentaMediaMensual);
              console.log('Alquiler calculado:', alquilerCalculado);
              console.log('Alquiler calculado 1:', alquilerCalculado1);
              console.log('Alquiler calculado 2:', alquilerCalculado2);
              const formatNumber = value => Number(value).toLocaleString('es-ES', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });

              document.getElementById('rentaMedia').textContent = formatNumber(rentaMedia) + ' €';
              document.getElementById('rentaMediaMensual').textContent = formatNumber(rentaMediaMensual) + ' €';
              document.getElementById('alquilerCalculado1').textContent = formatNumber(alquilerCalculado1) + ' €';
              document.getElementById('alquilerCalculado2').textContent = formatNumber(alquilerCalculado2) + ' €';
              document.getElementById('result').classList.remove('d-none');

            });
        }
      })
      .catch(error => {
        document.getElementById('error').classList.remove('d-none');
        console.error('Error:', error);
      });
  });
}
