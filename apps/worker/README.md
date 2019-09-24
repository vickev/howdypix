# @howdypix/app-worker

This process is responsible to:

- Wait for photos to process (exif, thumbnails)
- Send the result of the process to RabbitMQ

It is possible to start multiple workers that will process simultaneously the photos.
