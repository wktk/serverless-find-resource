class CognitoUserPoolIdFinder {
  
  async find(name, region) {
    region = region ?? this.provider.serverless.configurationInput.region
    const aws_info = region ? { region } : {}

    if (!this.userPoolIds) {
      // See for available functions https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
      const cognito = new this.provider.sdk.CognitoIdentityServiceProvider(aws_info)
      const response = await new Promise((resolve, reject) => {
        cognito.listUserPools({ MaxResults: 60 }, (err,data) => {
          if (err) reject(err)
          resolve(data)
        })
      })

      if (response) {
        this.userPoolIds = {}
        for (const pool of response.UserPools) {
          this.userPoolIds[pool.Name] = pool.Id
        }
      }
    }

    if (!this.userPoolIds) {
      // See for available functions https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
      const response = await this.provider.request(
        "CognitoIdentityServiceProvider",
        "listUserPools",
        {
          MaxResults: 60,
        }
      )
      if (response) {
        this.userPoolIds = {}
        for (const pool of response.UserPools) {
          this.userPoolIds[pool.Name] = pool.Id
        }
      }
    }

    const poolKeys = Object.keys(this.userPoolIds)
    // If there's only one user pool and no name was provided, just use the only one in AWS
    if (!name && poolKeys.length > 0) {
      return this.userPoolIds[poolKeys[0]]
    } else {
      return this.userPoolIds[name]
    }
  }
}

module.exports = CognitoUserPoolIdFinder
