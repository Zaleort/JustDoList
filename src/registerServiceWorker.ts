/* tslint:disable:no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
        console.log(
            'La aplicación se está ejecutando desde caché por un Service Worker.\n' +
            'Para más información, visita https://goo.gl/AFskqB',
        );
        },
        cached() {
            console.log('El contenido se ha añadido a la caché para su uso offline.');
        },
        updatefound() {
            console.log('Descargando actualizaciones...');
        },
        updated() {
            console.log('Actualización disponible, por favor, refresca la página.');
        },
        offline() {
            console.log('Sin conexión a internet. La aplicación se está ejecutando en modo offline.');
        },
        error(error) {
            console.error('Error durante el registro del Service Worker:', error);
        },
    });
}
