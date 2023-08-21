import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface OIDCProviderStackProps extends cdk.StackProps {
  repositoryName: string;
  repositoryOwner: string;
}

export class OIDCProviderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OIDCProviderStackProps) {
    super(scope, id, props);

    const gitHubIdProvider = new iam.CfnOIDCProvider(this, 'OIDCProviderGithub', {
      url: 'https://token.actions.githubusercontent.com',
      clientIdList: [
        'sts.amazonaws.com',
      ],
      // dummy value
      thumbprintList: ['0123456789012345678901234567890123456789'],
    });

    const principalFederatedSub = `repo:${props.repositoryOwner}/${props.repositoryName}:*`;
    const ghaRole = new iam.Role(this, 'GitHubOidcRole', {
      // roleName: 'github-oidc-role',
      assumedBy: new iam.FederatedPrincipal(
        gitHubIdProvider.getAtt('Arn').toString(),  // federated
        {
          StringLike: {
            'token.actions.githubusercontent.com:sub': principalFederatedSub,  // !Sub repo:${GitHubOrg}/${RepositoryName}:*
          },
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          }
        },
        'sts:AssumeRoleWithWebIdentity',
      )
    });

    ghaRole.attachInlinePolicy(new iam.Policy(this, 'SamplePolicy', {
      // https://docs.aws.amazon.com/service-authorization/latest/reference/list_awscodecommit.html
      statements: [
        new iam.PolicyStatement({
          actions: [
            'iam:ListOpenIDConnectProviders',
          ],
          resources: ['*'],
        })
      ]
    }));
  }
}
