# README

This repository is intended for testing the recent update mentioned below:

https://github.blog/changelog/2023-07-13-github-actions-oidc-integration-with-aws-no-longer-requires-pinning-of-intermediate-tls-certificates/

According to this update, it's no longer necessary to use the thumbprint for the `AWS::IAM::OIDCProvider` resource when leveraging the GitHub Actions service as an Identity Provider (IdP).

This change is also highlighted in the AWS documentation:

> AWS secures communication with some OIDC identity providers (IdPs) through our library of trusted root certificate authorities (CAs) instead of using a certificate thumbprint to verify your IdP server certificate. These OIDC IdPs include Auth0, GitHub, Google, and those that use an Amazon S3 bucket to host a JSON Web Key Set (JWKS) endpoint. In these cases, your legacy thumbprint remains in your configuration, but is no longer used for validation.
> 
> reference: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html

It is possible to create `AWS::IAM::OIDCProvider` resource without `ThumbprintList` property if you use GitHub as IdP. You needs to specify `Url` and `ClientIdList` property only. But CloudFormation parameter spec has not allowed blank value for `ThumbprintList` property.

When using GitHub as your IdP, you can now create the `AWS::IAM::OIDCProvider` resource without specifying the `ThumbprintList` property. Instead, you only need to provide the `Url` and `ClientIdList` properties. However, as of now, CloudFormation's parameter specifications do not allow for the `ThumbprintList` property to be left blank

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html

This repository aims to test whether the OIDCProvider (specifically for GitHub) functions correctly if the `AWS::IAM::OIDCProvider` is created with a dummy value for the `ThumbprintList`.
