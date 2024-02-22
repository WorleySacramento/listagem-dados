import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import * as Dialog  from "@radix-ui/react-dialog";

const createTagSchema = z.object({
  name: z.string().min(3,{ message:'Please enter at least 3 characters.' }),
  slug: z.string(),
})

type CreateTagSchema = z.infer<typeof createTagSchema>

function getSlug(input:string): string {
  return input.normalize("NFC").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g,'-');
}

const TagForm = () => {
  const { register, handleSubmit, watch} = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema),
  })

  function createTag(data:CreateTagSchema){
console.log(data)
  }

  // const slug = getSlug(watch('name'))

  const name = watch('name');
  const slug = name && getSlug(name) ;


  return ( 
    <form onSubmit={handleSubmit(createTag)} className=" space-y-6 p-4">
      <div className=" flex flex-col space-y-2">
      <label className=" text-sm font-medium" htmlFor="name">Tag Name</label>
      <input className=" h-8 rounded-md text-black"  type="text" id="name"  {...register('name')} />
      </div>

      <div className=" flex flex-col space-y-2">
      <label className=" text-sm font-medium" htmlFor="slug">Slug</label>
      <input className=" h-8 rounded-md text-black" type="text" id="slug" readOnly value={slug}  {...register('slug')}/>
      </div>
      
      <div className="flex mt-20 justify-between">
        <div> 
        <Dialog.Close asChild>       
        <Button type="button" className="h-10 bg-red-300 text-red-950"><X/> Cancelar</Button>
        </Dialog.Close> 
        </div>
        <div>
        <Button type="submit" className="h-10 bg-teal-400 text-teal-950"><Check/> Salvar</Button>
          </div>
      </div>
    </form>
   );
}
 
export default TagForm;