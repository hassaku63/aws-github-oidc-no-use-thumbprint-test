#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OIDCProviderStack } from '../lib/aws-github-oidc-provider-stack';

const app = new cdk.App();
new OIDCProviderStack(app, 'AwsGithubOidcNoUseThumbprintTestStack', {
  repositoryName: 'aws-github-oidc-no-use-thumbprint-test',
  repositoryOwner: 'hassaku63',
});
