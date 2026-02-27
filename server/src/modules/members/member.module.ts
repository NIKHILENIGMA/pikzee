import { db } from '@/core/db/connection'
import { MemberRepository } from './member.repository'
import { IMemberService, MemberService } from './member.service'
import { MemberController } from './member.controller'

const memberRepository = new MemberRepository(db)
const memberService = new MemberService(memberRepository)
const memberController = new MemberController(memberService)

export { memberService, IMemberService, memberController, memberRepository }
