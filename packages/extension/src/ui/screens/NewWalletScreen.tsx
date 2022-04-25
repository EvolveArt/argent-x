import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { BackButton } from "../components/BackButton"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { InputText } from "../components/InputText"
import { FormError, H2, P } from "../components/Typography"
import { routes } from "../routes"
import { useAccount } from "../states/account"
import { useAppState } from "../states/app"
import { validatePassword, validatePhoneNumber } from "../states/seedRecover"
import { connectAccount, deployAccount } from "../utils/accounts"
import { recover } from "../utils/recovery"
import { StickyGroup } from "./ConfirmScreen"

const Container = styled.div`
  padding: 48px 40px 24px;
  display: flex;
  flex-direction: column;

  ${InputText} {
    margin-top: 15px;
  }
  ${Button} {
    margin-top: 116px;
  }
`

export const NewWalletScreen: FC<{
  overrideSubmit?: (values: { password: string; phoneNumber: string }) => void
  overrideTitle?: string
  overrideSubmitText?: string
}> = ({ overrideSubmit, overrideTitle, overrideSubmitText }) => {
  const navigate = useNavigate()
  const { addAccount } = useAccount()
  const { switcherNetworkId } = useAppState()
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<{
    password: string
    repeatPassword: string
    phoneNumber: string
  }>({
    criteriaMode: "firstError",
  })
  const password = watch("password")
  const phoneNumber = watch("phoneNumber")

  const handleDeploy = async (password?: string) => {
    if (!password) {
      return
    }
    useAppState.setState({ isLoading: true })

    if (overrideSubmit) {
      await overrideSubmit({ password, phoneNumber })
    } else {
      try {
        const newAccount = await deployAccount(switcherNetworkId, password)
        addAccount(newAccount)
        connectAccount(newAccount)
        navigate(await recover())
      } catch (error: any) {
        useAppState.setState({ error })
        navigate(routes.error())
      }
    }
    useAppState.setState({ isLoading: false })
  }

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <Container>
        <H2>{overrideTitle || "New wallet"}</H2>
        <P>Enter a password to protect your wallet</P>
        <form onSubmit={handleSubmit(({ password }) => handleDeploy(password))}>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: true, validate: validatePassword }}
            render={({ field: { ref, ...field } }) => (
              <InputText
                autoFocus
                type="password"
                placeholder="Password"
                {...field}
              />
            )}
          />
          {errors.password?.type === "required" && (
            <FormError>A new password is required</FormError>
          )}
          {errors.password?.type === "validate" && (
            <FormError>Password is too short</FormError>
          )}

          <Controller
            name="repeatPassword"
            control={control}
            rules={{ validate: (x) => x === password }}
            defaultValue=""
            render={({ field: { ref, ...field } }) => (
              <InputText
                type="password"
                placeholder="Repeat password"
                {...field}
              />
            )}
          />
          {errors.repeatPassword?.type === "validate" && (
            <FormError>Passwords do not match</FormError>
          )}

          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            rules={{ required: true, validate: validatePhoneNumber }}
            render={({ field: { ref, ...field } }) => (
              <InputText type="tel" placeholder="Phone Number" {...field} />
            )}
          />
          {errors.phoneNumber?.type === "required" && (
            <FormError>A phone number is required</FormError>
          )}
          {errors.phoneNumber?.type === "validate" && (
            <FormError>Phone Number invalid</FormError>
          )}

          <StickyGroup>
            <Button type="submit" disabled={!isDirty}>
              {overrideSubmitText || "Create wallet"}
            </Button>
          </StickyGroup>
        </form>
      </Container>
    </>
  )
}
