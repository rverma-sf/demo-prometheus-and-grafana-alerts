# Demo Alerting in Prometheus and Grafana 

Grafana Alerting is built on the Prometheus Alerting model. This demo project showcases the similarities between Prometheus and Grafana alerting systems, covering topics such as:

- Creating alerts in Prometheus
- Recreating the same alerts using Grafana
- Setting up alerts based on Loki logs
- Exploring alerting components like evaluation groups and notification policies
- Creating template notifications
- And more!

This project pairs well with this [Alerting Presentation Template](https://docs.google.com/presentation/d/1XvJnBlNnXUjiS409ABN4NxNkFZoYDmoRKKoJqsvln-g/edit?usp=sharing). Together, they provide an excellent starting point for presenting the Prometheus Alerting model and demonstrating its use in Grafana.

## Included Setup
This repository includes a [Docker Compose setup](./docker-compose.yaml) that bundles the following services:

- Grafana
- Prometheus
- Prometheus Alertmanager
- Loki
- SMTP server (for testing email notifications)


## Generating test data

This demo uses [Grafana k6](https://grafana.com/docs/k6) to generate test data for Prometheus and Loki.

To run k6 tests and store logs in Loki and time series data in Prometheus, you'll need a k6 version with the `xk6-client-prometheus-remote` and `xk6-loki` extensions.

You can build the k6 version using Docker as follows:

### macOS

```bash
docker run --rm -it -e GOOS=darwin -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" \
  grafana/xk6 build v0.55.0 \
  --with github.com/grafana/xk6-client-prometheus-remote@v0.3.2 \
  --with github.com/grafana/xk6-loki@v1.0.0
```

### Linux

```bash
docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" \
  grafana/xk6 build v0.55.0 \
  --with github.com/grafana/xk6-client-prometheus-remote@v0.3.2 \
  --with github.com/grafana/xk6-loki@v1.0.0
```


### Windows

```bash
docker run --rm -it -e GOOS=windows -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" `
  grafana/xk6 build v0.55.0 --output k6.exe `
  --with github.com/grafana/xk6-client-prometheus-remote@v0.3.2 `
  --with github.com/grafana/xk6-loki@v1.0.0
```

Then, you can run the tests in the `testdata` folder as follows:

```bash
./k6 run testdata/<FILE>.js
```


## Receive webhook notifications

One of the simplest ways to receive alert notifications is by using a Webhook.  You can use [`webhook.site`](https://webhook.site/) to create Webhook URLs and view the incoming messages.

- For Prometheus alertmanager: 
  
  Set the Webhook URL to the [alertmanager.yml](./alertmanager/alertmanager.yml) configuration file.

- For Grafana:
  
  Create a Webhook contact point and assign it to the notification policy.

## Receive mail notifications

You can also configure notifications to be sent via your Gmail account using an [App Password](https://support.google.com/accounts/answer/185833?hl=en). After creating your App password:

- For Prometheus Alertmanager:

  Replace `your_mail@gmail` with your Gmail address in the [alertmanager.yml](./alertmanager/alertmanager.yml) configuration file.

  Copy `alertmanager/smtp_auth_password.example` to `alertmanager/smtp_auth_password` and set your password.

- For Grafana:

  Copy `environments/smpt.env.example` to `environments/smpt.env` and set the appropriate environment variables values.