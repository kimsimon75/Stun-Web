const fs = require('node:fs');
const path = require('node:path');
const ref = name => ({ Ref: name });
const sub = text => ({ 'Fn::Sub': text });
const attr = (name, key) => ({ 'Fn::GetAtt': [name, key] });
const template = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: 'Authenticated patch note publisher for Stun Web',
    Resources: {
        Logs: { Type: 'AWS::Logs::LogGroup', Properties: { LogGroupName: '/aws/lambda/PublishPatchNote', RetentionInDays: 14 } },
        Role: { Type: 'AWS::IAM::Role', Properties: {
            AssumeRolePolicyDocument: { Version: '2012-10-17', Statement: [{ Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' }, Action: 'sts:AssumeRole' }] },
            Policies: [{ PolicyName: 'PublishPatchNotesOnly', PolicyDocument: { Version: '2012-10-17', Statement: [
                { Effect: 'Allow', Action: ['s3:GetObject', 's3:PutObject'], Resource: ['arn:aws:s3:::patchnote/patchnotes/*'] },
                { Effect: 'Allow', Action: 's3:ListBucket', Resource: 'arn:aws:s3:::patchnote', Condition: { StringLike: { 's3:prefix': ['patchnotes/*'] } } },
                { Effect: 'Allow', Action: 'lambda:InvokeFunction', Resource: sub('arn:${AWS::Partition}:lambda:${AWS::Region}:${AWS::AccountId}:function:PutUpdate') },
                { Effect: 'Allow', Action: ['logs:CreateLogStream', 'logs:PutLogEvents'], Resource: attr('Logs', 'Arn') },
            ] } }],
        } },
        Publisher: { Type: 'AWS::Lambda::Function', Properties: { FunctionName: 'PublishPatchNote', Runtime: 'nodejs22.x', Handler: 'index.handler', Timeout: 25, MemorySize: 256,
            Role: attr('Role', 'Arn'), Environment: { Variables: { PATCH_BUCKET: 'patchnote', NOTIFY_FUNCTION: 'PutUpdate' } },
            Code: { ZipFile: fs.readFileSync(path.join(__dirname, 'publish-patch/index.cjs'), 'utf8') },
        } },
        Api: { Type: 'AWS::ApiGatewayV2::Api', Properties: { Name: 'StunPatchPublisher', ProtocolType: 'HTTP' } },
        Integration: { Type: 'AWS::ApiGatewayV2::Integration', Properties: { ApiId: ref('Api'), IntegrationType: 'AWS_PROXY', IntegrationUri: attr('Publisher', 'Arn'), PayloadFormatVersion: '2.0', TimeoutInMillis: 29000 } },
        Route: { Type: 'AWS::ApiGatewayV2::Route', Properties: { ApiId: ref('Api'), RouteKey: 'POST /patchnotes', AuthorizationType: 'AWS_IAM', Target: { 'Fn::Join': ['/', ['integrations', ref('Integration')]] } } },
        Stage: { Type: 'AWS::ApiGatewayV2::Stage', Properties: { ApiId: ref('Api'), StageName: '$default', AutoDeploy: true, DefaultRouteSettings: { ThrottlingBurstLimit: 2, ThrottlingRateLimit: 1 } } },
        Permission: { Type: 'AWS::Lambda::Permission', Properties: { FunctionName: ref('Publisher'), Action: 'lambda:InvokeFunction', Principal: 'apigateway.amazonaws.com', SourceArn: sub('arn:${AWS::Partition}:execute-api:${AWS::Region}:${AWS::AccountId}:${Api}/*/POST/patchnotes') } },
    },
    Outputs: {
        PublishUrl: { Value: sub('https://${Api}.execute-api.${AWS::Region}.${AWS::URLSuffix}/patchnotes') },
        CallerResource: { Description: 'Grant execute-api:Invoke on this ARN to the publishing identity', Value: sub('arn:${AWS::Partition}:execute-api:${AWS::Region}:${AWS::AccountId}:${Api}/$default/POST/patchnotes') },
    },
};
fs.writeFileSync(path.join(__dirname, 'patch-publisher.template.json'), JSON.stringify(template, null, 2) + '\n');
console.log('Created aws/patch-publisher.template.json');
