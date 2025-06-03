
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { chargeId } = await req.json()

    if (!chargeId) {
      return new Response(
        JSON.stringify({ error: 'ID da cobrança é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const response = await fetch(`https://staging.api.cashtime.com.br/pix/charge/${chargeId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer sk_live_16s79VVMskXKR5aNo/bkmwrYKil06vGzk5ikRxuMUiL3c61oNrDkUTBM+czH+sRSqd7QpPJ/AA5ujs/P+pHQ4cE2YfemAW4E/Ug4U2nZ8+rvRNzqObMgnohELrFCL9FXYJUuURnJHwoP08LitWNlcwcJrZaXN+6g8uxBKp4CmvE=',
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
