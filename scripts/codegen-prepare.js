/* eslint-disable */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { argv } = require('yargs').options({
  input: {
    type: 'array',
    demandOption: true,
    describe: 'Input contract path(s)',
  },
  output: {
    type: 'string',
    demandOption: true,
    describe: 'Output path for ABIs',
  },
})

const filterFields = (entryName, fields) => {
  return fields.filter(({ name, type, internalType }) => {
    const include =
      (!type || !type.endsWith('[][]')) &&
      (!internalType || !internalType.endsWith('[][]'))

    if (!include) {
      const msg = `Excluding multi-dimensional array field ${name} on ${entryName}`
      const line = '-'.repeat(msg.length)
      console.log(line)
      console.warn(chalk.redBright(msg))
      console.log(line)
    }

    return include
  })
}

const filterAbi = (abi) => {
  return abi.map(({ inputs, outputs, ...entry }) => ({
    ...entry,
    ...(inputs ? { inputs: filterFields(entry.name, inputs) } : {}),
    ...(outputs ? { outputs: filterFields(entry.name, outputs) } : {}),
  }))
}

/**
 * Copy ABIs into one location and filter out types not handled by The Graph:
 * https://github.com/graphprotocol/graph-cli/issues/342
 */
const main = async () => {
  const { input, output } = argv
  await Promise.all(
    input.flatMap(async (inputPath) => {
      const allFilePaths = await fs.promises.readdir(inputPath, {
        withFileTypes: true,
      })

      const jsonFilePaths = allFilePaths.filter(({ name }) => {
        return name.endsWith('json')
      })

      const jsonFiles = await Promise.all(
        jsonFilePaths.map(({ name }) => {
          return fs.promises.readFile(path.join(inputPath, name))
        }),
      )

      const abis = await Promise.all(
        jsonFiles.map((buffer) => {
          const { contractName, abi } = JSON.parse(buffer)
          const filteredAbi = filterAbi(abi)
          return JSON.stringify({ contractName, abi: filteredAbi }, null, 2)
        }),
      )

      return Promise.all(
        jsonFilePaths.map(({ name }, index) => {
          const contents = abis[index]
          return fs.promises.writeFile(path.join(output, name), contents)
        }),
      )
    }),
  )
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
