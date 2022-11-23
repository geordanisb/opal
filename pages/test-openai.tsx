import { GetServerSideProps,NextPage } from 'next';
import { useState, useEffect, SyntheticEvent, ChangeEvent, MouseEventHandler, FormEvent } from 'react';


interface Props {
}

const TestOpenai: NextPage<Props> = () => {
  const [loading,setLoading] = useState(false)
  const [text,setText] = useState('')
  const [images,setImages] = useState<HTMLImageElement[]>([])

  function onTextChange(e:ChangeEvent<HTMLTextAreaElement>){
    setText(e.target.value)
  }
  async function onSubmit(form:FormEvent<HTMLFormElement>){
    setLoading(true)
    setImages([])
    form.preventDefault()
    const url = '/api/openai/createImage'
    // const url = 'https://eurekastaging.azurewebsites.net/api/openai/createImage'
    const {data:{data}} =  await fetch(url,{
      method:'POST',
      headers:{
          'Content-type':'application/json'
      },
      body:JSON.stringify({text})
    }).then(r=>r.json())

    const promises = (data as {b64_json:string}[]).map(d=>{
      return new Promise((resolve,reject)=>{
        const img = new Image()
        img.onload = function(){
          setImages(res=>[...res,img])
          resolve(true)
        }
        img.src = `data:image/webp;base64,${d.b64_json}`
      })
    })
    await Promise.all(promises)
    setLoading(false)
  }

  const renderImages = ()=>{
    return images.map((img,idx)=><img key={idx} src={img.src}/>)
  }

  return <>
      <form onSubmit={onSubmit}>
        <textarea value={text} onChange={onTextChange}></textarea>
        <button type='submit' disabled={loading}>submit</button>
      </form>
      <div>
        {!loading ? renderImages():'...loading'}
      </div>
  </>
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  return {
    props: {},
  };
};


export default TestOpenai;
