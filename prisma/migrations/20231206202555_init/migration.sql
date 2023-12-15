-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imageoccurrence" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occurrenceId" TEXT NOT NULL,

    CONSTRAINT "Imageoccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrence" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_registrationNumber_key" ON "Employee"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "occurrence_description_key" ON "occurrence"("description");

-- AddForeignKey
ALTER TABLE "Imageoccurrence" ADD CONSTRAINT "Imageoccurrence_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "occurrence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence" ADD CONSTRAINT "occurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence" ADD CONSTRAINT "occurrence_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
