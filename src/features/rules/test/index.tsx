import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Copy, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { PROJECT_USER_ID } from '@/features/projects/constants'
import { useAuthStore } from '@/stores/auth'
import {
  getPersistedRulesAuth,
  getRulesAuthUserId,
  getRulesAuthUserKey,
} from '../lib/auth'
import { getRulesApiBaseUrl, runRule } from '../api'

type Language =
  | 'shell'
  | 'javascript'
  | 'node'
  | 'python'
  | 'php'
  | 'go'
  | 'java'

type RulesAuthUser = {
  user_id?: string
  userId?: string
  id?: string
  user_key?: string
  userKey?: string
}

const DEFAULT_RULE_USER_ID =
  import.meta.env.VITE_RULE_USER_ID || PROJECT_USER_ID
const DEFAULT_RULE_USER_KEY = import.meta.env.VITE_RULE_USER_KEY || ''

function getFirstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim()) || ''
}

function getSearchParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams()
  }

  return new URLSearchParams(window.location.search)
}

export function RuleTest() {
  const user = useAuthStore((s) => s.user) as RulesAuthUser | null
  const accessToken = useAuthStore((s) => s.accessToken)
  const persistedAuth = getPersistedRulesAuth()
  const persistedUser = persistedAuth.user as RulesAuthUser | null
  const authToken = getFirstNonEmpty(accessToken, persistedAuth.accessToken)
  const searchParams = getSearchParams()
  const initialUserId = searchParams.get('userId') || ''
  const initialProjId = searchParams.get('projId') || ''
  const initialUserKey = searchParams.get('userKey') || ''
  const [userId, setUserId] = useState(getFirstNonEmpty(
    initialUserId,
    getRulesAuthUserId(user, authToken),
    getRulesAuthUserId(persistedUser, authToken),
    DEFAULT_RULE_USER_ID
  ))
  const [userKey, setUserKey] = useState(
    getFirstNonEmpty(
      initialUserKey,
      getRulesAuthUserKey(user, authToken),
      getRulesAuthUserKey(persistedUser, authToken),
      DEFAULT_RULE_USER_KEY
    )
  )
  const [projId, setProjId] = useState(initialProjId)
  const [data, setData] = useState('{}')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>('shell')
  const [codeSnippet, setCodeSnippet] = useState('')

  const baseUrl = getRulesApiBaseUrl()

  const languages = [
    { value: 'shell' as Language, label: 'Shell' },
    { value: 'javascript' as Language, label: 'JavaScript' },
    { value: 'node' as Language, label: 'Node' },
    { value: 'python' as Language, label: 'Python' },
    { value: 'php' as Language, label: 'PHP' },
    { value: 'go' as Language, label: 'Go' },
    { value: 'java' as Language, label: 'Java' },
  ]

  useEffect(() => {
    const nextSearchParams = getSearchParams()
    const nextUserId = nextSearchParams.get('userId') || ''
    const nextUserKey = nextSearchParams.get('userKey') || ''

    setUserId(
      getFirstNonEmpty(
        nextUserId,
        getRulesAuthUserId(user, authToken),
        getRulesAuthUserId(persistedUser, authToken),
        DEFAULT_RULE_USER_ID
      )
    )
    setUserKey(
      getFirstNonEmpty(
        nextUserKey,
        getRulesAuthUserKey(user, authToken),
        getRulesAuthUserKey(persistedUser, authToken),
        DEFAULT_RULE_USER_KEY
      )
    )
  }, [authToken, persistedUser?.id, persistedUser?.userId, persistedUser?.userKey, persistedUser?.user_id, persistedUser?.user_key, user])

  useEffect(() => {
    const searchParams = getSearchParams()
    const incomingUserId = searchParams.get('userId')
    const incomingProjId = searchParams.get('projId')
    const incomingUserKey = searchParams.get('userKey')

    if (incomingUserId) {
      setUserId(incomingUserId)
    }
    if (incomingProjId) {
      setProjId(incomingProjId)
    }
    if (incomingUserKey) {
      setUserKey(incomingUserKey)
    }
  }, [])

  useEffect(() => {
    generateCode()
  }, [userId, userKey, projId, data, currentLang])

  const generateCode = () => {
    const url = `${baseUrl}/run?user_id=${userId}&user_key=${userKey}&proj_id=${projId}`
    const jsonData = data || '{}'

    switch (currentLang) {
      case 'shell':
        setCodeSnippet(`curl -X 'POST' \\
  '${url}' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '${jsonData}'`)
        break

      case 'javascript':
        setCodeSnippet(`fetch('${url}', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: '${jsonData}'
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))`)
        break

      case 'node':
        setCodeSnippet(`const https = require('https')

const data = JSON.stringify(${jsonData})

const options = {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request('${url}', options, (res) => {
  let body = ''
  res.on('data', (chunk) => body += chunk)
  res.on('end', () => console.log(JSON.parse(body)))
})

req.on('error', (error) => console.error(error))
req.write(data)
req.end()`)
        break

      case 'python':
        setCodeSnippet(`import requests
import json

url = '${url}'
headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}
data = ${jsonData}

response = requests.post(url, headers=headers, json=data)
print(response.json())`)
        break

      case 'php':
        setCodeSnippet(`<?php
$url = '${url}';
$data = json_encode(${jsonData});

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
        break

      case 'go':
        setCodeSnippet(`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    data := []byte(\`${jsonData}\`)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(data))
    req.Header.Set("accept", "application/json")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`)
        break

      case 'java':
        setCodeSnippet(`import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        String url = "${url}";
        String json = "${jsonData}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("accept", "application/json")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`)
        break
    }
  }

  const handleTest = async () => {
    const missingFields = [
      !userId && 'user_id',
      !userKey && 'user_key',
      !projId && 'proj_id',
    ].filter(Boolean)

    if (missingFields.length > 0) {
      toast.error(`请填写必填字段: ${missingFields.join(', ')}`)
      return
    }

    setLoading(true)

    try {
      const parsedData = JSON.parse(data || '{}')
      const result = await runRule(
        { user_id: userId, user_key: userKey, proj_id: projId },
        parsedData
      )
      setResponse(JSON.stringify(result, null, 2))
      toast.success('测试成功')
    } catch {
      setResponse('请检查输入参数是否符合规范')
      toast.error('测试失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/rules'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>业务调用 API</h2>
            <p className='text-muted-foreground'>测试规则接口调用</p>
          </div>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='h-fit'>
          <CardHeader className='space-y-4'>
            <div>
              <CardTitle>接口信息</CardTitle>
            </div>
            <div className='flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-3'>
              <span className='rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'>
                POST
              </span>
              <span className='text-sm font-mono'>{baseUrl}/run</span>
            </div>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='user_id' className='text-sm font-medium'>
                user_id *
              </Label>
              <Input
                id='user_id'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className='font-mono text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='user_key' className='text-sm font-medium'>
                user_key *
              </Label>
              <Input
                id='user_key'
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                className='font-mono text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='proj_id' className='text-sm font-medium'>
                proj_id *
              </Label>
              <Input
                id='proj_id'
                value={projId}
                onChange={(e) => setProjId(e.target.value)}
                className='font-mono text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='data' className='text-sm font-medium'>
                请求体 (JSON) *
              </Label>
              <Textarea
                id='data'
                value={data}
                onChange={(e) => setData(e.target.value)}
                rows={10}
                placeholder='{"key": "value"}'
                className='font-mono text-sm leading-6'
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='space-y-4'>
            <div className='flex items-center justify-between'>
              <CardTitle>代码示例</CardTitle>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => handleCopy(codeSnippet)}
              >
                <Copy className='mr-2 size-4' />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Tabs
              value={currentLang}
              onValueChange={(value) => setCurrentLang(value as Language)}
            >
              <TabsList className='mb-4 h-auto flex-wrap'>
                {languages.map((lang) => (
                  <TabsTrigger key={lang.value} value={lang.value}>
                    {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={currentLang}>
                <pre className='max-h-80 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs leading-6 text-slate-50'>
                  {codeSnippet}
                </pre>
              </TabsContent>
            </Tabs>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base'>响应结果</CardTitle>
                <Button onClick={handleTest} disabled={loading}>
                  <Play className='mr-2 size-4' />
                  {loading ? '测试中...' : '测试'}
                </Button>
              </div>
              {response ? (
                <pre className='max-h-96 overflow-x-auto rounded-md border bg-slate-50 p-4 text-xs leading-6'>
                  {response}
                </pre>
              ) : (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  点击测试按钮查看响应结果
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
