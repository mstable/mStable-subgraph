/* eslint-disable */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

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
 * Copy ABIs and filter out types not handled by The Graph:
 * https://github.com/graphprotocol/graph-cli/issues/342
 */
const main = async () => {
  const INPUT_DIR = './lib/mStable-contracts/build/contracts/'
  const OUTPUT_DIR = './abis/'

  const paths = (
    await fs.promises.readdir(INPUT_DIR, {
      withFileTypes: true,
    })
  ).filter(({ name }) => {
    return name.endsWith('json')
  })

  const files = await Promise.all(
    paths.map(({ name }) => {
      return fs.promises.readFile(path.join(INPUT_DIR, name))
    }),
  )

  const fileContents = files.map((buffer) => {
    const { contractName, abi } = JSON.parse(buffer)
    const filteredAbi = filterAbi(abi)
    return JSON.stringify({ contractName, abi: filteredAbi }, null, 2)
  })

  await Promise.all(
    paths.map(({ name }, index) => {
      const contents = fileContents[index]
      return fs.promises.writeFile(path.join(OUTPUT_DIR, name), contents)
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
