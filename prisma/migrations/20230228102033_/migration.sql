-- CreateTable
CREATE TABLE "Messages" (
    "message_id" SERIAL NOT NULL,
    "user_id" TEXT,
    "username" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "msg" TEXT,
    "to" TEXT,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_message_id_key" ON "Messages"("message_id");
