import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../../interfaces/IAzureConfig'
import { RunCreateModel } from '../../model/runCreateModel'
import { getPoints } from './testCasePoints'
import * as TestInterfaces from 'azure-devops-node-api/interfaces/TestInterfaces'
import { AxiosInstance } from 'axios'

export async function createTestRun(
  azureClient: ITestApi,
  axiosClient: AxiosInstance,
  azureConfig: IAzureConfig,
  testResultIds?: number[]
): Promise<TestInterfaces.TestRun> {
  const plan = {
    id: `${azureConfig.planId}`,
    name: azureConfig.runName,
  }

  let pointIds = await getPoints(axiosClient, azureConfig, testResultIds)

  const testRunModel = new RunCreateModel(azureConfig.runName, plan, pointIds)

  return azureClient.createTestRun(testRunModel, azureConfig.projectId)
}

export async function setInProgressRun(
  azureClient: ITestApi,
  azureConfig: IAzureConfig,
  testRunId: number
): Promise<TestInterfaces.TestRun> {
  const inProgressRunModel: TestInterfaces.RunUpdateModel = {
    state: 'InProgress',
  }

  return azureClient.updateTestRun(
    inProgressRunModel,
    azureConfig.projectId,
    testRunId
  )
}

export async function setCompletedRun(
  azureClient: ITestApi,
  azureConfig: IAzureConfig,
  testRunId: number
): Promise<TestInterfaces.TestRun> {
  const inProgressRunModel: TestInterfaces.RunUpdateModel = {
    state: 'Completed',
  }

  return azureClient.updateTestRun(
    inProgressRunModel,
    azureConfig.projectId,
    testRunId
  )
}

export async function getLastTestRunId(
  azureClient: ITestApi,
  azureConfig: IAzureConfig
): Promise<number> {
  const testRun = await azureClient.getTestRuns(
    azureConfig.projectId,
    undefined,
    undefined,
    undefined,
    azureConfig.planId,
    undefined,
    undefined,
    undefined
  )
  if (!testRun || !testRun.length) {
    throw new Error()
  }

  return testRun[testRun.length - 1].id
}
