-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_articleId_fkey";

-- CreateTable
CREATE TABLE "TagsArticles" (
    "tagId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "TagsArticles_pkey" PRIMARY KEY ("articleId","tagId")
);

-- AddForeignKey
ALTER TABLE "TagsArticles" ADD CONSTRAINT "TagsArticles_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsArticles" ADD CONSTRAINT "TagsArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
