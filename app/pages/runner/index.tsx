import { LoadingMain } from "app/core/components/LoadingMain"
import { Runner } from "app/core/components/Runner"
import Layout from "app/core/layouts/Layout"
import { Head } from "blitz"
import { Suspense } from "react"

const RunnerPage = () => {
  return (
    <>
      <Head>
        <title>{`Runner | Bdash Server`}</title>
      </Head>
      <Suspense fallback={<LoadingMain />}>
        <Runner />
      </Suspense>
    </>
  )
}

// To avoid treating this as a static page. Plotly.js can be loaded only on browser, so rendering is always failed in build time.
export async function getServerSideProps() {
  return {
    props: {},
  }
}

RunnerPage.authenticate = true
RunnerPage.getLayout = (page) => <Layout>{page}</Layout>

export default RunnerPage
