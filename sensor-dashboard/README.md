# Tableau de bord thermique

Application Angular standalone qui simule une sonde envoyant un relevé chaque seconde. Le cycle se termine après cinq relevés valides ; une mesure supérieure à 50 °C déclenche l'erreur `Sonde en surchauffe`.

## Lancer l'application

```bash
npm.cmd install
npm.cmd start
```

Ouvrir ensuite `http://localhost:4200/`.

Le bouton **Arrêter l'urgence** annule l'écoute. L'AsyncPipe se désabonne automatiquement lorsque `sensorData$` repasse à `null` ; l'Observable nettoie alors son intervalle. Le statut reflète la fin normale, l'erreur ou l'annulation.

## Vérification

```bash
npm.cmd test
npm.cmd run build
```
