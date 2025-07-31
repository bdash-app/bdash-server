import db from "db"

async function testDbAccess() {
  try {
    console.log("データベース接続をテストしています...")
    
    // bdashQueryテーブルから最初のレコードを取得
    const firstQuery = await db.bdashQuery.findFirst({
      select: {
        id: true,
        id_hash: true,
        title: true,
        userId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    })

    if (firstQuery) {
      console.log("✅ データベースアクセス成功!")
      console.log("取得したレコード:")
      console.log(JSON.stringify(firstQuery, null, 2))
    } else {
      console.log("⚠️  データベースは接続できましたが、bdashQueryテーブルにデータがありません")
    }

    // レコード数も確認
    const count = await db.bdashQuery.count()
    console.log(`\nテーブル内の総レコード数: ${count}`)

  } catch (error) {
    console.error("❌ データベースアクセス中にエラーが発生しました:", error)
  } finally {
    // Prismaクライアントを切断
    await db.$disconnect()
    console.log("\nデータベース接続を切断しました")
  }
}

// スクリプトが直接実行された場合にテストを実行
if (require.main === module) {
  testDbAccess()
}

export default testDbAccess