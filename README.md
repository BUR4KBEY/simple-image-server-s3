# Simple Image Server using AWS S3 Bucket 🖼️

This repository is dedicated to providing basic implementations and operations for working with AWS S3 buckets. Our goal is to efficiently read and write images using the S3 bucket infrastructure. Additionally, we utilize the local machine's disk as a cache to minimize the number of requests made to AWS.

## Why do we store images on the disk when using S3 buckets? 🤔

The rationale behind this approach is caching and minimizing latency. When we store images on the local disk instead of sending every request to AWS, we significantly reduce the latency associated with retrieving images. By leveraging the local cache, we can quickly access the images without relying solely on network requests to AWS. This approach not only improves the overall performance of the image server but also reduces the dependency on network speed and availability.

Our images remain securely stored in the S3 bucket while benefiting from the reduced latency provided by the local disk cache. This strategy proves especially useful in scenarios where frequent access to images is required, as it eliminates the need for repetitive round trips to the remote storage infrastructure.

Additionally, storing images on the local disk facilitates easy migration of the project to another virtual machine. The images can be fetched from the S3 bucket, ensuring a seamless transition without the need to transfer all the images to the new environment.

In summary, by utilizing the disk cache alongside the AWS S3 bucket, we strike a balance between low latency and reliable image storage, enhancing the overall performance and scalability of the image server.

## Important Note ⚠️

This project serves as an example usage. For enhanced validation, we recommend utilizing third-party packages such as [**Joi**](https://www.npmjs.com/package/joi). Additionally, you have the flexibility to create your own `Store` by extending your store class with the `BaseStore` class.

## Getting Started 🚀

To get started with the project, follow these steps:

1.  Create a new file called `.env` by copying the `.env.example` file and filling in the required environment variables.
2.  Install the project dependencies by executing the command `yarn install`.
3.  Build the project using the command `yarn build`, and then launch the project with `yarn start:prod`.

Optionally, if you want to run the project in `development` mode, you can start it by executing the command `yarn start:dev`.

By following these steps, you will set up the necessary configuration and launch the image server. 🌟

## Creating an AWS S3 Bucket 🪣

To use this project, you'll need an [AWS S3 bucket](https://aws.amazon.com/s3/). Follow these steps to create a bucket:

1. Sign in to your [**AWS**](https://aws.amazon.com/) account (or create one if you don't have it yet).
2. Use the search bar at the top of the page to find and select the **S3** service.
3. Click the **Create bucket** button to create a new bucket.
4. Provide a **unique** name for your bucket and configure the remaining settings. In most cases, the default settings are suitable and secure.

Once you've completed these steps, your AWS S3 bucket will be created. Now, let's proceed to creating a new user and policy to manage the bucket. But before that...

## Ensuring Security for Your Bucket 🔒

Policies are fundamental for ensuring the security of your AWS resources, including your S3 bucket. It's crucial to set them up correctly and implement appropriate access controls to protect your data.

Make sure you have checked the **Block all public access** checkbox while creating the S3 bucket. If you didn't, please delete the old bucket and create a new one with that option checked to prevent unauthorized access.

Remember, properly configuring policies and access controls is essential for maintaining the security and privacy of your AWS resources.

## Accessing the S3 Bucket Programmatically 💻

To access the S3 bucket programmatically, we need to create a separate user and assign that user to a pre-made policy for the bucket using the **IAM** (Identity and Access Management) service in AWS.

Here's how you can do it:

1. Create a new policy for the bucket:

   1. Use the search bar at the top of the page to find and select the **IAM** service.

   2. Select **Policies** under **Access management** from the sidebar.

   3. Click the **Create policy** button.

   4. Select the **S3** service.

   5. Open the **Read** section, find `GetObject`, select it, and then you can close the **Read** section.

   6. Open the **Write** section, find `PutObject`, select it, and then you can close the **Write** section.

   7. Click the **Add arn** button in the **Resources** section.

      - Enter the bucket's name in the **Resource bucket name** section.

      - Check the **Any object name** checkbox in the **Resource object name** section, then click the **Add ARNs** button to finish.

   8. Click the **Next** button at the bottom of the page.

   9. Give your policy a name, and then click the **Create policy** button to finish.

2. Create a new user:

   1. Select **Users** under **Access management** from the sidebar.

   2. Click the **Add users** button to create a new user.

   3. Provide a name for your user, and then click the **Next** button.

   4. Select **Attach policies directly**, search for the created policy name, select it.

   5. Click the **Next** button, and then click **Create user** button to finish the process.

3. Create access tokens for the user:

   1. Select the created user.

   2. Click the **Security credentials** tab.

   3. Scroll down and click the **Create access key** button.

   4. Select **Application running outside AWS** or **Other**.

   5. Click the **Next** button, and then click the **Create access key** button.

   6. Copy and securely save the **Access key** and **Secret access key** values. Treat the **secret access key** as a **password** and keep it private, <ins>as it provides access to the user.</ins> ⚠️

   7. Click the **Done** button to finish the process.

Now, you can access the AWS user account programmatically using the **access key** and **secret access key**. Ensure that you fill the `.env` file with the correct information, including the access keys.

Make sure to handle the secret access key **securely** and keep it confidential to maintain the security of your AWS resources.
