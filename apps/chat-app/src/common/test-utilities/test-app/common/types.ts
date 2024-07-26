import { TestInterfaceModule } from '../interface'
import { TestModule } from '../no-interface'

export type CommonTestModule = TestInterfaceModule | TestModule
