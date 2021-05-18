Server:

A se rula maven install.

Client:

Pentru a putea rula clientul este necesara instalarea node js (https://nodejs.org/en/download/).

In momentul in care nodejs este instalat se vor rula urmatoarele comenzi in path-ul clientului:

```
npm install -g grpc-tools
npm install
npm rebuild --target=12.0.8 --runtime=electron --dist-url=https://atom.io/download/electron
```

Pentru a rula aplicatia client se foloseste comanda:

```
npm start
```
