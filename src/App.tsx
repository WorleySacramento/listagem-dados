import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Button } from './components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Control, Input } from './components/ui/input'
import { Pagination } from './components/pagination'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useDebounceValue from './hooks/use-debounce-value'

// import { useEffect, useState } from 'react'
// import useDebounceValue from './hooks/use-debounce-value'


export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  id: string
  title: string
  idTitle: string
  amountVideos: number
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter') ?? ''
  const [filter, setFilter] = useState(urlFilter)
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1


  const debouncedFilter = useDebounceValue(filter, 1000)

  // useEffect(() =>{
  //   setSearchParams( params => {
  //     params.set('page','1')

  //     return params
  //   })
  // },[debouncedFilter, setSearchParams])

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', urlFilter, page, debouncedFilter],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_limit=5&title_like=${urlFilter}`)
      const data = await response.json()

      // delay ms
      await new Promise(resolve => setTimeout(resolve, 2000))

      return data
    },
    placeholderData: keepPreviousData,

  })
  // console.log(tagsResponse)

  function handleFiltered() {
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  if (isLoading) {
    return null
  }
  // const uniqueKey = `${tag.id}-${tag.title}-${index}`;

  return (
    <div className=' px-3 py-10 space-y-8'>
      <Header />
      <Tabs />
      <main className='max-w-6xl mx-auto space-y-5'>
        <div className='flex items-center gap-3.5'>
          <h1 className=' text-xl font-bold'>Tags</h1>
          <Button variant='primary' className=" inline-flex items-center gap-1.5 text-xs bg-teal-300 text-teal-950 font-medium rounded-full px-1.5 py-1">
            <Plus className=' size-3' />
            Criar Novo
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input variant='filter'>
              <Search className=' size-35' />
              <Control placeholder='Pesquise' onChange={e => setFilter(e.target.value)} value={filter} />
            </Input>
            <Button variant='default' type='submit' onClick={handleFiltered}>
              {/* <Filter className='size-4' /> */}
              Pesquisar
            </Button>
          </div>
          <div className="flex">
            <Button variant='default' >
              <FileDown className='size-4' />
              Export</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>amount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {tagsResponse?.map((tag, index) => {
              return (
                <TableRow key={index}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{tag.idTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tag.amountVideos} Vídeo(s)
                  </TableCell>
                  <TableCell className=' text-right'>
                    <Button size='icon'>
                      <MoreHorizontal className='size-5' />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>

        </Table>
        {tagsResponse && <Pagination items={tagsResponse.items} page={page} pages={tagsResponse.pages} />}

      </main>
    </div>
  )
}


