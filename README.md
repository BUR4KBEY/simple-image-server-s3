# Simple Image Server using AWS S3 Bucket 🖼️

This repository is dedicated to providing basic implementations and operations for working with AWS S3 buckets. Our goal is to efficiently read and write images using the S3 bucket infrastructure. Additionally, we utilize the local machine's disk as a cache to minimize the number of requests made to AWS.

## Why do we store images on the disk when using S3 buckets? 🤔

The rationale behind this approach is caching and minimizing latency. When we store images on the local disk instead of sending every request to AWS, we significantly reduce the latency associated with retrieving images. By leveraging the local cache, we can quickly access the images without relying solely on network requests to AWS. This approach not only improves the overall performance of the image server but also reduces the dependency on network speed and availability.

Our images remain securely stored in the S3 bucket while benefiting from the reduced latency provided by the local disk cache. This strategy proves especially useful in scenarios where frequent access to images is required, as it eliminates the need for repetitive round trips to the remote storage infrastructure.

Additionally, storing images on the local disk facilitates easy migration of the project to another virtual machine. The images can be fetched from the S3 bucket, ensuring a seamless transition without the need to transfer all the images to the new environment.

In summary, by utilizing the disk cache alongside the AWS S3 bucket, we strike a balance between low latency and reliable image storage, enhancing the overall performance and scalability of the image server.

## Important Note ⚠️

This project serves as an example usage. For enhanced validation, we recommend utilizing third-party packages such as [**Joi**](https://www.npmjs.com/package/joi). Additionally, you have the flexibility to create your own `Store` by extending your store class with the `BaseStore` class.
