  import defaultRouter from '@/router/default'
  import sessionRouter from '@/router/session'
  import volanteRouter from '@/router/volante'
  import sorteioRouter from '@/router/sorteio'
  import apostasRouter from '@/router/apostas'
  import administracaoRouter from '@/router/administracao'

  export default [
    ...defaultRouter,
    ...sessionRouter,
    ...volanteRouter,
    ...apostasRouter,
    ...sorteioRouter,
    ...administracaoRouter
]