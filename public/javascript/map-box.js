mapboxgl.accessToken = mbxToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
	center: elsewhere.geometry.coordinates, // starting position [lng, lat]
	zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
	.setLngLat(elsewhere.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h4>${elsewhere.title}</h4><p>${elsewhere.location}</p>`
		)
	)
	.addTo(map);
