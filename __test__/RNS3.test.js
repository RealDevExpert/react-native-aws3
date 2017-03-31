import { RNS3 } from '../src/RNS3'
import { Request } from '../src/Request'
import { S3Policy } from '../src/S3Policy'

describe('RNS3.put', () => {

  const file = {
    uri: 'assets-library://asset/image.jpg?id=655DBE66-8008-459C-9358-914E1FB532DD',
    name: 'image.jpg',
    type: 'image/jpg'
  }

  const options = {
    bucket: 'my-s3-bucket',
    region: 'us-east-1',
    accessKey: 'AKIAA7AS6DHAD6ASN23',
    secretKey: 'pLx+brfx0u12ERMcJCfNAEOKH+bMk40ZVa7hh8'
  }

  const originalRequestCreate = Request.create
  const originalS3PolicyGenerate = S3Policy.generate

  beforeEach(() => {
    Request.create = jest.fn()
    S3Policy.generate = jest.fn()
  })

  afterEach(() => {
    Request.create = originalRequestCreate
    S3Policy.generate = originalS3PolicyGenerate
  })

  it('generates a policy and performs a request', () => {
    const policy = Symbol('policy')
    S3Policy.generate.mockReturnValueOnce(policy)

    const mockRequest = {
      set: jest.fn(() => mockRequest),
      send: jest.fn(() => mockRequest),
      then: jest.fn(() => mockRequest)
    }

    Request.create.mockReturnValueOnce(mockRequest)

    const result = RNS3.put(file, options)
    expect(result).toBe(mockRequest)

    const s3PolicyGenerateMock = S3Policy.generate.mock
    expect(s3PolicyGenerateMock.calls.length).toBe(1)
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('date')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('key', 'image.jpg')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('contentType', 'image/jpg')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('bucket', 'my-s3-bucket')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('region', 'us-east-1')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('accessKey', 'AKIAA7AS6DHAD6ASN23')
    expect(s3PolicyGenerateMock.calls[0][0]).toHaveProperty('secretKey', 'pLx+brfx0u12ERMcJCfNAEOKH+bMk40ZVa7hh8')

    const requestCreateMock = Request.create.mock
    expect(requestCreateMock.calls.length).toBe(1)
    expect(requestCreateMock.calls[0][0]).toBe('https://my-s3-bucket.s3.amazonaws.com')
    expect(requestCreateMock.calls[0][1]).toBe('POST')
    expect(requestCreateMock.calls[0][2]).toBe(policy)

    const mockRequestSetMock = mockRequest.set.mock
    expect(mockRequestSetMock.calls.length).toBe(1)
    expect(mockRequestSetMock.calls[0][0]).toBe('file')
    expect(mockRequestSetMock.calls[0][1]).toBe(file)
  })

})
